"use strict";

module.exports = (sequelize, DataTypes) => {
    const archivo = sequelize.define('archivo', {
        ruta: {  type: DataTypes.STRING(100), defaultValue: "NONE" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true });
    archivo.associate=function(models){
        archivo.belongsTo(models.documento,{
            foreignKey:'id_documento'
        });
    };
    
    return archivo;
    
};