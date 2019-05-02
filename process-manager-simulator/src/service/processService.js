import Processes from '../data/sampleProcess.json';

class ProcessService {

    cicleState = 1;

    listAll(){
        return Processes;
    }

    selectRandon(quantityItens){
        let shuffledProcesses = Processes.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
        shuffledProcesses.map(p => p["cicles"] = this.getRandonCicles())
        return shuffledProcesses.slice(0,quantityItens)
    }

    getRandonCicles(){
        return Math.floor(Math.random() * 200) + 50; //Returns a randon number between 50 and 200
    }

}

export default ProcessService