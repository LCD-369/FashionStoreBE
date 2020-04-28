var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = require('chai').assert;
var expect = chai.expect;
var server = require('../bin/server');
var app = require('../app/app');
// var request = require("supertest");
// var agent = request.agent(app);
chai.use(chaiHttp);
var requester = chai.request(app).keepOpen();

describe('Products API', () => {

  context("GET /api/products", () => {
    it("Should return all products", (done) => {
      requester.get("/api/products")
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  context("GET /api/products/", () => {
    it("Should return an error status 404", (done) => {
      requester.get("/api/products/test")
      .end(function(err, res) {
        expect(res).to.have.status(404);
        done();
      });
    });
  });

  context("GET /api/products/gender/:GENDER", () => {
    it("Should return all products matching the gender parameter", (done) => {
      let gender = 'Male';
      requester.get('/api/products/gender/'+gender).send(gender)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        // expect(req).to.have.param('GENDER');
        expect(res.body.length).to.be.gt(2);
        done();
      });
    });
  });

  describe("GET /api/products/category/:CATEGORY", () => {
    it("Should return all products matching the category parameter", (done) => {
      let category = 'Adult';
      requester.get('/api/products/category/'+category).send(category)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.gt(2);
        done();
      });
    });
  });

  describe("GET /api/products/gender/category/:GENDER/:CATEGORY", () => {
    it("Should return all products matching the category parameter", (done) => {
      let category = 'Adult';
      let gender = 'Male';
      requester.get('/api/products/gender/category/'+gender+'/'+category)
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(req).to.have.param('GENDER', 'CATEGORY');
        expect(res.body.length).to.be.gt(2);
        done();
      });
    });
  });

});
