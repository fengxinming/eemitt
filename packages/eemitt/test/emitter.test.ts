import { expect, it, describe } from 'vitest';
import { Emitter, EmitterEventer } from '../src/index';

describe('测试事件对象', () => {
  it('测试多种方式触发事件', () => {
    const emitter1 = new Emitter();

    emitter1.on('testevent', (evt) => {
      expect(evt instanceof EmitterEventer).toBe(true);
    });
    emitter1.on('testevent2', (evt) => {
      expect(evt.num).toBe(1);
    });

    emitter1.emit({ type: 'testevent2', num: 1 });
    emitter1.emit('testevent');
  });

  it('测试多事件绑定', () => {
    const emitter1 = new Emitter();
    let i = 0;
    const fn = () => {
      i++;
    };

    emitter1.on(['event1', 'event2', 'event3', null as unknown as any], () => {
      i += 2;
    });
    emitter1.emit('event1'); // 2
    emitter1.emit('event2'); // 4
    emitter1.emit('event3'); // 6
    emitter1.emit('event4'); // 6
    expect(i).toBe(6);
    emitter1.on('event4', fn);
    emitter1.emit('event4'); // 7
    expect(i).toBe(7);

    emitter1.on(null as unknown as string, () => {
      i++;
    });
    emitter1.emit('null'); // 10 触发了2个null事件
    expect(i).toBe(10);

    emitter1.on('event5', null as unknown as any);
    emitter1.emit('event5'); // 10
    expect(i).toBe(10);

    emitter1.once(['event1', 'event2', 'event3'], () => {
      i += 4;
    });
    emitter1.emit('event1'); // 16
    emitter1.emit('event2'); // 22
    emitter1.emit('event3'); // 28
    expect(i).toBe(28);

    emitter1.once('event4', () => {
      i += 2;
    });
    emitter1.emit('event4'); // 31
    expect(i).toBe(31);

    expect(emitter1.emit('event1')).toBe(1); // 33

    emitter1.emit('event6'); // 33
    expect(i).toBe(33);

    emitter1.removeAllListeners('event1');
    expect(emitter1.emit('event1')).toBe(0); // 33

    emitter1.off('event2', null as unknown as any);
    emitter1.emit('event2'); // 35
    expect(i).toBe(35);

    emitter1.removeAllListeners(['event2', 'event3', 'event']);
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(35); // 35

    emitter1.emit('event6'); // 35;
    expect(i).toBe(35);

    emitter1.removeAllListeners();
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    emitter1.emit('event4');
    expect(i).toBe(35);
  });

  it('测试阻止事件广播', () => {
    const emitter2 = new Emitter();
    let i = 0;
    emitter2.on('stopImmediatePropagation', () => {
      i++;
    });
    emitter2.on('stopImmediatePropagation', (evt) => {
      i += 2;
      evt.stopImmediatePropagation();
    });
    emitter2.on('stopImmediatePropagation', () => {
      i += 3;
    });

    emitter2.emit('stopImmediatePropagation');
    expect(i).toBe(3);
  });

  it('测试重复事件绑定', () => {
    const emitter1 = new Emitter();
    let i = 0;
    const fn = (evt) => {
      i++;
      expect(evt.arg).toBe('hello');
    };
    emitter1.once('event1', fn); // 1
    emitter1.on('event1', fn); // 2
    emitter1.emit({ type: 'event1', arg: 'hello' }); // 2
    expect(i).toBe(2);

    const fn2 = () => {
      i += 2;
    };
    emitter1.off(['event1'], fn2);
    emitter1.emit({ type: 'event1', arg: 'hello' }); // 3
    expect(i).toBe(3);

    emitter1.off('event10', fn); // 3
    expect(i).toBe(3);
  });
});
