/* eslint-env mocha */
/* globals apiClients */
'use strict'

const expect = require('chai').expect
const isNode = require('detect-node')
const path = require('path')
const test = require('interface-ipfs-core')

let testfile

testfile = require('fs').readFileSync(path.join(__dirname, '/../testfile.txt'))

// Load the add/cat/get/ls commands from interface-ipfs-core
const common = {
  setup: function (cb) {
    cb(null, apiClients.a)
  },
  teardown: function (cb) {
    cb()
  }
}

test.files(common)

// Describe the (mfs) tests
describe('.files (pseudo mfs)', () => {
  it('files.mkdir', (done) => {
    apiClients.a.files.mkdir('/test-folder', function (err) {
      expect(err).to.not.exist
      done()
    })
  })

  it('files.cp', (done) => {
    apiClients.a.files
      .cp(['/ipfs/Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP', '/test-folder/test-file'], (err) => {
        expect(err).to.not.exist
        done()
      })
  })

  it('files.ls', (done) => {
    apiClients.a.files.ls('/test-folder', (err, res) => {
      expect(err).to.not.exist
      expect(res.Entries.length).to.equal(1)
      done()
    })
  })

  it('files.write', (done) => {
    apiClients.a.files
      .write('/test-folder/test-file-2.txt', new Buffer('hello world'), {create: true}, (err) => {
        expect(err).to.not.exist

        apiClients.a.files.read('/test-folder/test-file-2.txt', (err, stream) => {
          expect(err).to.not.exist

          let buf = ''
          stream
            .on('error', (err) => {
              expect(err).to.not.exist
            })
            .on('data', (data) => {
              buf += data
            })
            .on('end', () => {
              expect(buf).to.be.equal('hello world')
              done()
            })
        })
      })
  })

  it('files.write without options', (done) => {
    apiClients.a.files
      .write('/test-folder/test-file-2.txt', new Buffer('hello world'), (err) => {
        expect(err).to.not.exist

        apiClients.a.files.read('/test-folder/test-file-2.txt', (err, stream) => {
          expect(err).to.not.exist

          let buf = ''
          stream
            .on('error', (err) => {
              expect(err).to.not.exist
            })
            .on('data', (data) => {
              buf += data
            })
            .on('end', () => {
              expect(buf).to.be.equal('hello world')
              done()
            })
        })
      })
  })

  it('files.stat', (done) => {
    apiClients.a.files.stat('/test-folder/test-file', (err, res) => {
      expect(err).to.not.exist
      expect(res).to.deep.equal({
        Hash: 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP',
        Size: 12,
        CumulativeSize: 20,
        Blocks: 0,
        Type: 'file'
      })

      done()
    })
  })

  it('files.stat file that does not exist', (done) => {
    apiClients.a.files.stat('/test-folder/does-not-exist', (err, res) => {
      expect(err).to.exist
      if (err.code === 0) {
        return done()
      }
      throw err
    })
  })

  it('files.read', (done) => {
    if (!isNode) {
      return done()
    }

    apiClients.a.files.read('/test-folder/test-file', (err, stream) => {
      expect(err).to.not.exist
      let buf = ''
      stream
        .on('error', (err) => {
          expect(err).to.not.exist
        })
        .on('data', (data) => {
          buf += data
        })
        .on('end', () => {
          expect(new Buffer(buf)).to.deep.equal(testfile)
          done()
        })
    })
  })

  it('files.rm without options', (done) => {
    apiClients.a.files.rm('/test-folder/test-file-2.txt', (err) => {
      expect(err).to.not.exist
      done()
    })
  })

  it('files.rm', (done) => {
    apiClients.a.files.rm('/test-folder', {recursive: true}, (err) => {
      expect(err).to.not.exist
      done()
    })
  })

  describe('promise', () => {
    it('files.mkdir', () => {
      return apiClients.a.files.mkdir('/test-folder')
    })

    it('files.cp', () => {
      return apiClients.a.files
        .cp(['/ipfs/Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP', '/test-folder/test-file'])
    })

    it('files.ls', () => {
      return apiClients.a.files.ls('/test-folder')
        .then((res) => {
          expect(res.Entries.length).to.equal(1)
        })
    })

    it('files.write', (done) => {
      return apiClients.a.files
        .write('/test-folder/test-file-2.txt', new Buffer('hello world'), {create: true})
        .then(() => {
          return apiClients.a.files.read('/test-folder/test-file-2.txt')
        })
        .then((stream) => {
          let buf = ''
          stream
            .on('error', (err) => {
              expect(err).to.not.exist
            })
            .on('data', (data) => {
              buf += data
            })
            .on('end', () => {
              expect(buf).to.be.equal('hello world')
              done()
            })
        })
    })

    it('files.write without options', (done) => {
      return apiClients.a.files
        .write('/test-folder/test-file-2.txt', new Buffer('hello world'))
        .then(() => {
          return apiClients.a.files.read('/test-folder/test-file-2.txt')
        })
        .then((stream) => {
          let buf = ''
          stream
            .on('error', (err) => {
              expect(err).to.not.exist
            })
            .on('data', (data) => {
              buf += data
            })
            .on('end', () => {
              expect(buf).to.be.equal('hello world')
              done()
            })
        })
    })

    it('files.stat', () => {
      return apiClients.a.files.stat('/test-folder/test-file')
        .then((res) => {
          expect(res).to.deep.equal({
            Hash: 'Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP',
            Size: 12,
            CumulativeSize: 20,
            Blocks: 0,
            Type: 'file'
          })
        })
    })

    it('files.stat file that does not exist', () => {
      return apiClients.a.files.stat('/test-folder/does-not-exist')
        .catch((err) => {
          expect(err).to.exist
          expect(err.code).to.be.eql(0)
        })
    })

    it('files.read', (done) => {
      if (!isNode) {
        return done()
      }

      apiClients.a.files.read('/test-folder/test-file')
        .then((stream) => {
          let buf = ''
          stream
            .on('error', (err) => {
              expect(err).to.not.exist
            })
            .on('data', (data) => {
              buf += data
            })
            .on('end', () => {
              expect(new Buffer(buf)).to.deep.equal(testfile)
              done()
            })
        })
    })

    it('files.rm without options', () => {
      return apiClients.a.files.rm('/test-folder/test-file-2.txt')
    })

    it('files.rm', () => {
      return apiClients.a.files.rm('/test-folder', {recursive: true})
    })
  })
})
