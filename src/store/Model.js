// import Subject from './Subject';
const Subject = require('./Subject');

class Model extends Subject {
  setProperty(propName, propValue) {
    // console.log(this.constructor);
    // console.log(this.constructor.prototype);
    // this[propName] = propValue;
    console.log('previous Model', this.constructor.name, this);
    const newModel = Object.assign(Object.create(this.constructor.prototype), this);
    newModel[propName] = propValue;
    console.log('current Model', this.constructor.name, newModel);
    // newModel.makeApiCall();
    // console.log(newModel.constructor);
    this.dispatchEvent('change', newModel);
  }
}

// export default Model;
module.exports = Model;
