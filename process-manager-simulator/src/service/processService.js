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

    selectRandonDevice(){
        let devices = ["Impressora", "Vídeo", "HD"];
        return devices[Math.floor(Math.random() * devices.length - 1) + 0]
    }

    needToAcessDevice(){
        let chance = 100
        return Math.floor(Math.random() * chance) + 1 === 1
    }

    ciclesRandonHD(){
        return Math.floor(Math.random() * 200) + 300;
    }
    ciclesRandonVideo(){
        return Math.floor(Math.random() * 100) + 200;
    }
    ciclesRandonPrinter(){
        return Math.floor(Math.random() * 300) + 400;
    }

}

export default ProcessService