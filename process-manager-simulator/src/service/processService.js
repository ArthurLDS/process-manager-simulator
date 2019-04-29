import Processes from '../data/sampleProcess.json';

class ProcessService {

    cicleState = 1;



    listAll(){
        return Processes;
    }

    selectRandon(quantityItens){
        let shuffledProcesses = Processes.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
        return shuffledProcesses.slice(0,quantityItens)
    }

}

export default ProcessService