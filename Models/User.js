import { DataTypes } from "sequelize";
import db from "../Config/Sequelize.js";

const User = db.define('Users',{
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uuid:{
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate:{
      notEmpty: true
    }
  },
  firstName:{
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
      notEmpty: true,
      len: [3, 25]
    }
  },
  lastName:{
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
      notEmpty: true,
      len: [3, 25]
    }
  },
  phoneNumber:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate:{
      notEmpty: true,
      len: 10
    }
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
        notEmpty: true,
    }
  },
  role:{
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
        notEmpty: true
    }
  }
},{
  freezeTableName: true
});

export default User;