"use strict";

module.exports = (sequelize, DataTypes) => {
    const documento = sequelize.define('documento', {
        tipo_documento:{type: DataTypes.ENUM('LIBRO','AUDIOLIBRO'),allowNull: false, defaultValue: 'LIBRO'},
        autor: { type: DataTypes.STRING(100), defaultValue: "NONE" },
        sinopsis: { type: DataTypes.STRING(1000), defaultValue: "NONE" },
        genero: { type: DataTypes.STRING(100), defaultValue: "NONE" },
        precio: { type: DataTypes.DOUBLE, defaultValue: 0.0 },
        estado: {type:DataTypes.BOOLEAN,defaultValue:true},
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, {freezeTableName: true });
    documento.associate=function(models){
        documento.belongsTo(models.persona,{
            foreignKey:'id_persona'
        });
        documento.hasMany(models.archivo, 
            { foreignKey:'id_documento',as: 'archivo'
        });
    };
    return documento;
};