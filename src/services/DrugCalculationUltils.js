export default DrugCalculationUltils = {
    convert : {
        mcgPerMlToMgPerMl(value, round){
            return round? Math.round(value/1000 * 100) / 100 : value/1000
        },
        mgPerMlToMcgPerMl(value, round){
            return round ? Math.round(value*1000) : value*1000
        }
    }
}