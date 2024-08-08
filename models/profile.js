'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User,{
        foreignKey:"UserId"
      })
    }
  }
  Profile.init({
    fullName:{type:DataTypes.STRING,
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
    gender: {type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          args:true,
          msg: "Please Choose Your Gender"
        },
        notEmpty: {
          args: true,
          msg:"Please Choose Your Gender"
        }
      }
    },
    UserId: DataTypes.INTEGER,
    address: {type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          args:true,
          msg: "Please Input Your Address"
        },
        notEmpty: {
          args: true,
          msg:"Please Input Your Address"
        }
      }
    },
    phoneNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};