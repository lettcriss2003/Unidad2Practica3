"use strict";

module.exports = (sequelize, DataTypes) => {
    const venta = sequelize.define('venta', {
        fecha: { type: DataTypes.DATEONLY },
        subtotal: { type: DataTypes.DOUBLE, defaultValue: 0.0 },
        total: { type: DataTypes.DOUBLE, defaultValue: 0.0 },
        nombre_cliente: { type: DataTypes.STRING(100), defaultValue: "NONE" },
        celular_cliente: { type: DataTypes.STRING(100), defaultValue: "NONE" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, {freezeTableName: true });
    venta.associate=function(models){
        venta.belongsTo(models.persona,{
            foreignKey:'id_persona'
        });
        venta.belongsTo(models.documento,{
            foreignKey:'id_documento'
        });
    };
    return venta;
};