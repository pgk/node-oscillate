var assert = require('chai').assert,
    types = require('./../../lib/datatypes');

var ToOSC = types.ToOSC;
var OSCMessage = types.OSCMessage,
    OSCBundle = types.OSCBundle;


describe('OSC:', function () {

    describe('OSCMessage', function () {

        var topic = function () { return new OSCMessage('/foo'); };

        it('has an address', function() {
            assert.equal(topic().address, '/foo');
        });

        it('Has args array', function() {
            assert.isArray(topic().message);
        });

        it('args init length 0', function() {
            assert.equal(topic().message.length, 0);
        });

        describe('.append', function () {
            var topic = function () {
                var msg = new OSCMessage("/foo/bar");
                msg.append(1, 'i');
                return msg;
            };

            it('increases length of args by 4', function() {
                assert.equal(topic().message.length, 4);
            });

            it('increases length of tags by 1', function() {
                assert.equal(topic().typetags.length, 2);
            });

            it('toBinary returns array of all elements', function() {
                assert.deepEqual(topic().toBinary(), [ 47, 102, 111, 111, 47, 98, 97, 114, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1 ]);
            });

            it('append object literal', function() {
                var msg = new OSCMessage('/foo/bar');
                msg.append({i:1, j:2});
                assert.equal(3, msg.typetags.length);
            });

            it('append array', function () {
                var msg = new OSCMessage('/foo/bar');
                msg.append([1,2,3,'str', 0.1]);
                assert.equal(msg.typetags.length, 6);
                assert.equal(',iiisf', msg.typetags);
            });

        });

    });


    describe('OSCBundle', function () {

        it('appends message', function () {
            var msg = new OSCMessage('/foo/bar'),
                bundle;

            msg.append(['foo', 'bar', 1, 2, 3.3]);
            bundle = new OSCBundle('/address/one');
            bundle.append(msg);
            assert.equal(2, bundle.typetags.length);
        });

    });


    describe('String', function () {

        var topic = {
            actual: ToOSC.str('i am a string'),
            expected: [105, 32, 97, 109, 32, 97, 32, 115, 116, 114, 105, 110, 103, 0, 0, 0]
        };

        it('should return array, with correct length and bytefields', function() {
            assert.isArray(topic.actual);
            assert.equal(topic.actual.length, topic.expected.length);
            var foo = ToOSC.str('foobar');
            assert.equal(foo.length % 4, 0);
        });
        it('returns correct nums', function () {
            assert.deepEqual(topic.actual, topic.expected);
        });
    });

    describe('Int', function () {
        var topic = {
            num: ToOSC.argument(12345),
            expected: [ 0, 0, 48, 57 ]
        };

        it('returns array(4), with correct bytefields', function () {
            assert.isArray(topic.num[1]);
            assert.equal(topic.num[1].length, 4);
            assert.deepEqual(topic.num[1], topic.expected);
        });
    });

    describe('Float', function () {
     var topic =  {
         num: ToOSC.argument(0.12345) 
     };
     it('should return array, with correct length and bytefields', function () {
         assert.isArray(topic.num[1]);
         assert.equal(topic.num[1].length, 4);
         assert.deepEqual(topic.num[1], [ 61, 252, 211, 91 ]);
     });
    });

    describe('Blob', function () {
     var topic = {
         binary: ToOSC.blob('0.12345abcdefREWT%$^#^%^'),
         expected: [0,0,0,24,48,46,49,50,51,52,53,97,98,99,100,101,102,82,69,87,84,37,36,94,35,94,37,94]
     };
     it('should return array, with correct length and bytefields', function () {
         assert.isArray(topic.binary);
         assert.equal(topic.binary.length, 28);
         assert.deepEqual(topic.binary, topic.expected);
     });
    });

    describe('OSCTimeTag', function () {
     it('should return time now', function () {
         var date = new Date(),
             time = ToOSC.time_tag(date);
         assert.deepEqual([0,0,0,0,0,0,0,1], time);
     });
    });

    it('works with typehints', function () {
     var num = ToOSC.argument(12345, 'i'),
         flo = ToOSC.argument(0.12345, 'f'),
         dbl = ToOSC.argument(0.12345, 'd'),
         str = ToOSC.argument('i am a string', 's');
     assert.deepEqual(num[1], [ 0, 0, 48, 57 ]);
     assert.deepEqual(flo[1], [ 61, 252, 211, 91 ]);
     assert.deepEqual(dbl[1], [ 61, 252, 211, 91 ]);
     assert.deepEqual(str[1], [105, 32, 97, 109, 32, 97, 32, 115, 116, 114, 105, 110, 103, 0, 0, 0]);
    });
});
