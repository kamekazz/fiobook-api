var  deuda ={
    name:'manny',
    nota:'nada',

    dabets:[
        { nota:'sadfsfd',cantida:500,created: '12/08/12'},
        { nota:'sadfsfd',cantida:2,created: '12/08/12'},
        { nota:'sadfsfd',cantida:3,created: '12/08/12'},
        { nota:'sadfsfd',cantida:4,created: '12/08/12'},

    ],
    pagos:[
        { nota:'String',cantida:1000,created: '12/25/12'},
        { nota:'String',cantida:4,created: '12/25/12'},
        { nota:'String',cantida:4,created: '12/25/12'},
        { nota:'String',cantida:1,created: '12/25/12'},
        
    ],
    capmax:0,
    total:0,

}

let pagos1 = deuda.pagos
let totalpago = 0
    for (let index = 0; index < pagos1.length; index++) {
        totalpago += pagos1[index].cantida
    }

let dabets1 = deuda.dabets
let totalDeuda = 0
    for (let index = 0; index < dabets1.length; index++) {
            totalDeuda += dabets1[index].cantida
    }

totalpago

totalDeuda

deuda.total = totalDeuda - totalpago

console.log(deuda.total);