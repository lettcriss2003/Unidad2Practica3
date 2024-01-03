"use strict";

module.exports = (sequelize, DataTypes) => {
    const persona = sequelize.define('persona', {
        nombres: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        apellidos: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        direccion: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        ciudad: { type: DataTypes.STRING(20), defaultValue: "NONE" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, {freezeTableName: true });
    persona.associate=function(models){
        persona.hasOne(models.cuenta,{
            foreignKey:'id_persona',as:'cuenta'
        });
        persona.belongsTo(models.rol,{
            foreignKey:'id_rol'
        });
        persona.hasMany(models.venta,{
            foreignKey:'id_persona',as: 'venta'
        });
        persona.belongsToMany(models.documento,{
            through: 'PersonaDocumento'
        });
    };
    return persona;
};