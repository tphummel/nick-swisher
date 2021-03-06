'use strict'

const tap = require('tap')

const { move } = require('./index.js')

tap.test('moves correctly at all symmetric turns', function (t) {
  const headLocationTests = [
    { x: 0, y: 0, expected: 'right' },
    { x: 1, y: 1, expected: 'up' },
    { x: 2, y: 2, expected: 'right' },
    { x: 3, y: 3, expected: 'up' },
    { x: 4, y: 4, expected: 'right' },
    { x: 5, y: 5, expected: 'up' },
    { x: 6, y: 6, expected: 'right' },
    { x: 7, y: 7, expected: 'up' },
    { x: 8, y: 8, expected: 'right' },
    { x: 9, y: 9, expected: 'up' },
    { x: 9, y: 10, expected: 'left' },
    { x: 0, y: 10, expected: 'down' }
  ]

  const board = {
    height: 11,
    width: 11
  }

  for (const test of headLocationTests) {
    const game = {
      board: board,
      you: {
        head: {
          x: test.x,
          y: test.y
        }
      }
    }
    const result = move(game)
    t.equal(result.move, test.expected, `should move ${test.expected} at ${test.x},${test.y}`)
  }

  t.end()
})

tap.test('moves correctly at northwest corner', function (t) {
  const board = {
    height: 11,
    width: 11
  }

  const game = {
    board: board,
    you: {
      head: {
        x: 0,
        y: board.height - 1
      }
    }
  }
  const result = move(game)
  t.equal(result.move, 'down')

  t.end()
})

tap.test('moves correctly at southeast corner', function (t) {
  const board = {
    height: 11,
    width: 11
  }

  const game = {
    board: board,
    you: {
      head: {
        x: board.width - 1,
        y: 0
      }
    }
  }
  const result = move(game)
  t.equal(result.move, 'up')

  t.end()
})

tap.test('moves correctly at the north easement', function (t) {
  const headLocationTests = [
    { x: 1, y: 9, expected: 'right' },
    { x: 2, y: 9, expected: 'down' },
    { x: 3, y: 9, expected: 'right' },
    { x: 4, y: 9, expected: 'down' },
    { x: 5, y: 9, expected: 'right' },
    { x: 6, y: 9, expected: 'down' },
    { x: 7, y: 9, expected: 'right' },
    { x: 8, y: 9, expected: 'down' }
  ]

  const board = {
    height: 11,
    width: 11
  }

  for (const test of headLocationTests) {
    const game = {
      board: board,
      you: {
        head: {
          x: test.x,
          y: test.y
        }
      }
    }
    const result = move(game)
    t.equal(result.move, test.expected, `should move ${test.expected} at ${test.x},${test.y}`)
  }

  t.end()
})

tap.test('moves correctly at the east wall', function (t) {
  const board = {
    height: 11,
    width: 11
  }

  const headLocationTests = [
    { y: 1, x: board.width - 1, expected: 'left' },
    { y: 2, x: board.width - 1, expected: 'up' },
    { y: 3, x: board.width - 1, expected: 'left' },
    { y: 4, x: board.width - 1, expected: 'up' },
    { y: 5, x: board.width - 1, expected: 'left' },
    { y: 6, x: board.width - 1, expected: 'up' },
    { y: 7, x: board.width - 1, expected: 'left' },
    { y: 8, x: board.width - 1, expected: 'up' }
  ]

  for (const test of headLocationTests) {
    const game = {
      board: board,
      you: {
        head: {
          x: test.x,
          y: test.y
        }
      }
    }
    const result = move(game)
    t.equal(result.move, test.expected, `should move ${test.expected} at ${test.x},${test.y}`)
  }

  t.end()
})

tap.test('moves correctly on interior vertical straightaways', function (t) {
  const board = {
    height: 11,
    width: 11
  }

  const headLocationTests = [
    { x: 0, y: board.height - 3, expected: 'down' },
    { x: 1, y: board.height - 3, expected: 'up' },
    { x: 2, y: board.height - 3, expected: 'down' },
    { x: 3, y: board.height - 3, expected: 'up' },
    { x: 4, y: board.height - 3, expected: 'down' },
    { x: 5, y: board.height - 3, expected: 'up' },
    { x: 6, y: board.height - 3, expected: 'down' },
    { x: 7, y: board.height - 3, expected: 'up' }
  ]

  for (const test of headLocationTests) {
    const game = {
      board: board,
      you: {
        head: {
          x: test.x,
          y: test.y
        }
      }
    }
    const result = move(game)
    t.equal(result.move, test.expected, `should move ${test.expected} at ${test.x},${test.y}`)
  }

  t.end()
})

tap.test('moves correctly on interior horizontal straightaways', function (t) {
  const board = {
    height: 11,
    width: 11
  }

  const headLocationTests = [
    { y: 0, x: board.width - 2, expected: 'right' },
    { y: 1, x: board.width - 2, expected: 'left' },
    { y: 2, x: board.width - 2, expected: 'right' },
    { y: 3, x: board.width - 2, expected: 'left' },
    { y: 4, x: board.width - 2, expected: 'right' },
    { y: 5, x: board.width - 2, expected: 'left' },
    { y: 6, x: board.width - 2, expected: 'right' },
    { y: 7, x: board.width - 2, expected: 'left' },
    { y: 8, x: board.width - 2, expected: 'right' }
  ]

  for (const test of headLocationTests) {
    const game = {
      board: board,
      you: {
        head: {
          x: test.x,
          y: test.y
        }
      }
    }
    const result = move(game)
    t.equal(result.move, test.expected, `should move ${test.expected} at ${test.x},${test.y}`)
  }

  t.end()
})
