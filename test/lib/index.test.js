import { readFile } from 'fs';

const chai = require('chai');
const expect = chai.expect;
const analyzer = require('../../lib');

describe('analyzer library', () => {
    before(() => {
        analyzer.build({
          inputFile: './test/lib/testfile.log',
          dataFactor: 1
        });
    });

    it('should calculate statistics and chartDiv correctly', () => {
      analyzer.readFile(true).then(result => {
        expect(result.chartDiv).to.contain('<div class="ct-chart">');
        expect(result.chartTitle).to.eq('Steckdose1_Pwr');

        expect(result.statistics.fromTo).to.eq('22.01.2018 10:59:58 - 22.01.2018 11:23:00');
        expect(result.statistics.calculatedMinutes).to.eq(23.03);
        expect(result.statistics.usedEnergy).to.eq(159.5);
        expect(result.statistics.averagedPower).to.eq(379.07);

        expect(result.chartData.labels.length).to.eq(12);
      });
    });

    it('should get datapoint function names correctly', () => {
      let result = analyzer.getDataPointFunctionNames();
      expect(result.length).to.eq(2);
      expect(result).to.contain('useBlockAverage');
      expect(result).to.contain('useSpotCheck');
    });

    it('should calculator co2 emission correctly', () => {
      let result = analyzer.calculateCO2Emission(100);
      expect(result).to.eq(52.7);
    });

});