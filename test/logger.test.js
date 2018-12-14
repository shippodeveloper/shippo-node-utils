/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */
const Logger = require('./../').Logger;

describe('Logger', () => {
  let logger = new Logger({
    dirname: 'logs/'
  }).createLogger('test');

  it('log with object', () => {
    logger.info('Log info with object', {
      name: 'Hello world',
      type: 'Somethings'
    });
  });

  it('log error', () => {
    try {
      const a = 3;
      a = 5;
    } catch (e) {
      logger.error(e.message, e);
    }
  });

  it('handle exception', () => {
    // throw new Error("Something went wrong!");
  })
});