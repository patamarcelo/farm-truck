export const newMapArr = (mapPlot) => {
    const newArrMap = mapPlot?.map((data, index) => {
        if(index < 3){
            console.log('dataHere', data, '\n')
        }
        const newArr = data?.map_geo_points?.map((lonLat) => {
            return {
                latitude: parseFloat(lonLat?.latitude),
                longitude: parseFloat(lonLat?.longitude)
            };
        });
        return {
            talhaoCenterGeo: data?.map_centro_id,
            talhao: data?.talhao__id_talhao,
            farmCenterGeo: data?.talhao__fazenda__map_centro_id,
            farmName: data?.talhao__fazenda__nome,
            coords: newArr,
            cultura: data?.variedade__cultura__cultura,
            variedade: data?.variedade__nome_fantasia,
            culutraColor: data?.variedade__cultura__map_color,
            culturaColorLine: data?.variedade__cultura__map_color_line,
            ativo: !data?.plantio_descontinuado,
            idFarm: data?.talhao__fazenda__id_farmbox,
            idDjango: data?.pk,
            safra: data?.safra__safra,
            ciclo: data?.ciclo__ciclo,
            colheita: data?.finalizado_colheita,
            plantioFinalizado: data?.finalizado_plantio


        };
    });

    return newArrMap

} 