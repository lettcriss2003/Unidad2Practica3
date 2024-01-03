"use strict";



module.exports = (sequelize, DataTypes) => {
    const cuenta = sequelize.define('cuenta', {
        estado: {type:DataTypes.BOOLEAN,defaultValue:true},
        usuario: { type: DataTypes.STRING(100),allowNull:false },
        clave: { type: DataTypes.STRING(100),allowNull:false},
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true });
    cuenta.associate=function(models){
        cuenta.belongsTo(models.persona,{
            foreignKey:'id_persona'});
    };
    return cuenta;
};