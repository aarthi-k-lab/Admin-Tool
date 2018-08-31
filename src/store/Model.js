// import Subject from './Subject';
const Subject = require('./Subject');

class Model extends Subject {
  setProperty(propName, propValue) {
    // console.log(this.constructor);
    // console.log(this.constructor.prototype);
    // this[propName] = propValue;
    const newModel = Object.assign(Object.create(this.constructor.prototype), this);
    newModel[propName] = propValue;
    // newModel.makeApiCall();
    // console.log(newModel.constructor);
    this.dispatchEvent('change', newModel);
  }
}

// export default Model;
module.exports = Model;
