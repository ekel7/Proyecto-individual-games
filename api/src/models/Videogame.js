const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type:DataTypes.STRING(3000),
      allowNull:false,
    },
    released: {
      type: DataTypes.DATE,
      //type: DataTypes.DATEONLY
    },
    background_image:{
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.INTEGER
    },
    platforms: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  });
};
