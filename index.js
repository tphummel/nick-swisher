function move (reqBody) {
  const { board, you } = reqBody

  const shout = 'shout'
  let move

  const atNorthWall = you.head.y + 1 === board.height

  const atWestWall = you.head.x === 0
  const atEastWall = you.head.x + 1 === board.width
  const atSouthWall = you.head.y === 0
  const atNorthWestCorner = atNorthWall && atWestWall
  const atSouthWestCorner = atSouthWall && atWestWall
  const atSouthEastCorner = atSouthWall && atEastWall
  // const atNorthEastCorner = atNorthWall && atEastWall

  const isInteriorTurn = you.head.x === you.head.y
  const positionIsEven = you.head.x % 2 === 0

  if (atNorthWestCorner) {
    move = 'down'
  } else if (atSouthWestCorner) {
    move = 'right'
  } else if (atSouthEastCorner) {
    move = 'up'
  } else if (isInteriorTurn) {
    if (positionIsEven) {
      move = 'right'
    } else {
      move = 'up'
    }
  } else if (atNorthWall) {
    move = 'left'
  } else {
    move = ''
  }

  return { move, shout }
}

const isCloudFlareWorker = typeof addEventListener !== 'undefined' && addEventListener // eslint-disable-line

if (isCloudFlareWorker) {
  addEventListener('fetch', event => { // eslint-disable-line
    event.respondWith(handleRequest(event))
  })

  async function handleRequest (event) {
    const { request } = event
    const { pathname } = new URL(request.url)

    console.log(request.method, request.pathname)
    let eventData = getEventData(event)

    if (request.method === 'GET') {
      console.log(new Map(request.headers))

      const body = {
        apiversion: '1',
        author: 'tphummel',
        color: '#888888',
        head: 'viper',
        tail: 'rattle',
        version: BATTLESNAKE_VERSION // eslint-disable-line
      }

      const res = new Response(JSON.stringify(body), { // eslint-disable-line
        status: 200,
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      })

      eventData.res_status = res.status
      event.waitUntil(postLog(eventData))
      return res
    }

    if (request.method !== 'POST') {
      const res = new Response('Not Found', { status: 404 }) // eslint-disable-line
      eventData.res_status = res.status
      event.waitUntil(postLog(eventData))
      return res
    }

    const reqBodyTxt = await request.text()
    const reqBody = JSON.parse(reqBodyTxt)
    eventData = mergeReqEvent(eventData, reqBody)
    let res

    if (pathname.startsWith('/start')) {
      res = new Response('OK', { status: 200 }) // eslint-disable-line

    } else if (pathname.startsWith('/move')) {
      const resBody = move(reqBody)

      eventData.res_move = resBody.move
      eventData.res_shout = resBody.shout
      eventData.move_is_choice = resBody.isChoice
      eventData.move_is_randomized = resBody.isRandomized

      const resBodyOut = {
        move: resBody.move,
        shout: resBody.shout
      }

      res = new Response(JSON.stringify(resBodyOut), { // eslint-disable-line
        status: 200,
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      })
    } else if (pathname.startsWith('/end')) {
      const gameId = eventData.game_id
      const mySnakeId = eventData.you_id

      const gameUrl = `https://engine.battlesnake.com/games/${gameId}`
      const opts = {
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }
      const gameRes = await fetch(gameUrl, opts) // eslint-disable-line
      const gameResText = await gameRes.text()
      const game = JSON.parse(gameResText)
      const me = game.LastFrame.Snakes.find(snake => snake.ID === mySnakeId)

      if (me.Death === null) {
        eventData.outcome = 'win'
      } else {
        eventData.outcome = 'loss'
        eventData.death_turn = me.Death.Turn
        eventData.death_cause = me.Death.Cause
        eventData.death_by = me.Death.EliminatedBy
      }
      res = new Response('OK', { status: 200 }) // eslint-disable-line
    } else {
      res = new Response('Not Found', { status: 404 }) // eslint-disable-line
    }

    eventData.res_status = res.status
    event.waitUntil(postLog(eventData))
    return res
  }

  function postLog (data) {
    console.log('sending event to honeycomb')
    return fetch('https://api.honeycomb.io/1/events/' + encodeURIComponent(HONEYCOMB_DATASET), { // eslint-disable-line
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers([['X-Honeycomb-Team', HONEYCOMB_KEY]]) // eslint-disable-line
    })
  }

  function getEventData (event) {
    const { pathname } = new URL(event.request.url)
    const cf = event.request.cf !== undefined ? event.request.cf : {}
    const headers = new Map(event.request.headers)

    return {
      battlesnake: BATTLESNAKE_NAME, // eslint-disable-line
      battlesnake_version: BATTLESNAKE_VERSION, // eslint-disable-line
      req_method: event.request.method,
      req_pathname: pathname,
      req_lat: cf.latitude,
      req_lon: cf.longitude,
      req_continent: cf.continent,
      req_country: cf.country,
      req_region: cf.region,
      req_city: cf.city,
      req_timezone: cf.timezone,
      req_region_code: cf.regionCode,
      req_metro_code: cf.metroCode,
      req_postal_code: cf.postalCode,
      req_colo: cf.colo,
      req_cf_ray: headers.get('cf-ray')
    }
  }

  function mergeReqEvent (eventData, reqBody) {
    eventData.game_id = reqBody.game.id
    eventData.game_timeout = reqBody.game.timeout
    eventData.game_source = reqBody.game?.source
    eventData.ruleset_name = reqBody.game?.ruleset?.name
    eventData.ruleset_version = reqBody.game?.ruleset?.version
    eventData.turn = reqBody.turn
    eventData.board_height = reqBody.board.height
    eventData.board_width = reqBody.board.width
    eventData.board_food_count = reqBody.board.food?.length
    eventData.board_hazard_count = reqBody.board.hazards?.length
    eventData.board_snakes_count = reqBody.board.snakes?.length
    eventData.you_id = reqBody.you.id
    eventData.you_name = reqBody.you.name
    eventData.you_health = reqBody.you.health
    eventData.you_length = reqBody.you.length
    eventData.you_shout = reqBody.you.shout
    eventData.you_squad = reqBody.you.squad
    eventData.you_latency = reqBody.you.latency
    eventData.you_head_x = reqBody.you.head.x
    eventData.you_head_y = reqBody.you.head.y

    return eventData
  }
} else {
  module.exports = { move }
}
