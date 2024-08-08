'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async getListByBrand(value){
      return await Car.findAll({
        where: {
          brand: value
        },
        order: [["price", "DESC"]],
      })
    }
    static associate(models) {
      // define association here
      Car.hasMany(models.Transaction, {
        foreignKey: "CarId"
      })
    }
  }
  Car.init({
    brand: {type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          args:true,
          msg: "Please Input Your Name"
        },
        notEmpty: {
          args: true,
          msg:"Please Input Your Name"
        }
      }
    },
    model: {type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          args:true,
          msg: "Please Input Your Name"
        },
        notEmpty: {
          args: true,
          msg:"Please Input Your Name"
        }
      }
    },
    released_date: {type: DataTypes.DATE,
      allowNull:false,
      validate:{
        notNull: {
          args: true,
          msg: "Please Input Date Found"
        },
        notEmpty: {
          args: true,
          msg: "Please Input Date Found"
        },
        isDecade(value){
          if(new Date().getFullYear() - new Date(value).getFullYear() > 10){
            throw "Maximum Car Release Date is no older than a decade"
          }
        }
      }
    },
    color: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    price: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Car',
  });

  return Car;
};