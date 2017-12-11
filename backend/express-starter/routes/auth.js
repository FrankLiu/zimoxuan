'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var NodeRSA = require('node-rsa');

function generateKeyPair(){
  var key = new NodeRSA({b: 1024});
  key.generateKeyPair();
  return {
    privateKey: key.exportKey('private'),
    publicKey: key.exportKey('public')
  };
}

function getKeyPair(){
  var publicKey = path.resolve(__dirname, './pems/rsa_public_key.pem');
  var privateKey = path.resolve(__dirname, './pems/rsa_private_key.pem');
  if(!(fs.existsSync(publicKey) && fs.existsSync(privateKey))){
    var keys = generateKeyPair();
    fs.writeFileSync(publicKey, keys.publicKey);
    fs.writeFileSync(privateKey, keys.privateKey);
  }

  return {
    publicKey: fs.readFileSync(publicKey).toString(),
    privateKey: fs.readFileSync(privateKey).toString()
  };
}

router.get('/keypair', function(req, res, next){
  res.send(getKeyPair());
});

var data = {foo: 'bar'};
router.get('/rsa/sign', function(req, res, next){
  var keys = getKeyPair();
  var key = new NodeRSA(keys.privateKey);
  res.send(key.sign(data, 'base64'));
});

router.get('/rsa/verify', function(req, res, next){
  var keys = getKeyPair();
  var key = new NodeRSA(keys.publicKey);
  var signature = 'NDAuFLRNeYYp3M2kGP6kPIF5f4XoyIxFjWEP+goBqn1vepLzQPgfthVh+AoMsjZPfS3DaXkqZS8YpseNvMuQ3+qyDlXc3tiFEu4ffftoRSL11Z20NJuqQAP37vF51v+aPpnmm6n2Lptqx+a7D59X7+ZK9E7ONQlp7vptzruQOjTXafkrCyjUtehzuXYDdHZoYs9OtB4HRrbDVi61iL8TzNT/RqE93WqEDlY+mwLYs3dRJaCcFI8xhqImKL3AOeu6w61cfHFi2iHA+8bqMbyQYMKCJhY0i1HHuV7NdK6wHYQbZMYKxWPzPX0RlqnRtqzx4gpQ/vcfVg2mOBTLJMnoLQ==';
  res.send(key.verify(data, signature, null, 'base64'));
});

router.get('/jwt/sign', function(req, res, next){
  var keys = getKeyPair();
  res.send(jwt.sign(data, keys.privateKey, {algorithm: 'RS256'}));
});

router.get('/jwt/verify', function(req, res, next){
  var keys = getKeyPair();
  var signature = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1MTI5OTc0NDJ9.hqS7UniGuGdbyIw663eOmKY6LVLU0m_yTyamdBPGYbwsYCqQNthCkNy2rutO81pKL-VxaFSodZAoEdjVkaWdyfSW7Uk4sbPHM5DkBZalXamQyhWc6xpympQXYXk92HEFIW6kOtjfcp0RbwtGU0UHAoQCTuU0V-qcN_mpseH0Bx3WQHGgsmYpsl5jorwYySuKmrv1ZYKAW4PbztzxDGlaQxypsfJlycnzXcYmsqld1fSYjbBSNuzfHKdTxe8ltTk-kWQfaL20FOGNL9IEwb_jj23HyhuLvvob3tvMN7YlXjq5f-7KSk-ALEWiDo5A6ROEwg1VZo-bS6ARAmJzngTERg';
  res.send(jwt.verify(signature, keys.publicKey, {algorithms: 'RS256'}));
});

module.exports = router;