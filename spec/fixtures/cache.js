import Bluebird from 'bluebird';
import Cacheman from 'cacheman';

const cache = new Cacheman({
  ttl: Infinity
});

Bluebird.promisifyAll(Cacheman.prototype);

export default cache;
