import { AggregationTallyOperatorFilter } from '../src/radon'
import { Cache } from '../src/structures'
import { AggregationTallyFilter, MirAggregationTallyFilterOperator } from '../src/types'

describe('AggregationTallyOperatorFilter', () => {
  describe('getMarkup', () => {
    it('without argument', () => {
      const mirOperator: MirAggregationTallyFilterOperator = AggregationTallyFilter.mode

      const cache = new Cache()
      const operator = new AggregationTallyOperatorFilter(cache, mirOperator, 0)

      const result = operator.getMarkup()
      const expected = {
        hierarchicalType: 'operator',
        id: 1,
        label: 'mode',
        markupType: 'select',
        options: [
          {
            hierarchicalType: 'operatorOption',
            label: 'deviationAbsolute',
            markupType: 'option',
            outputType: 'filterOutput',
          },
          {
            hierarchicalType: 'operatorOption',
            label: 'deviationRelative',
            markupType: 'option',
            outputType: 'filterOutput',
          },
          {
            hierarchicalType: 'operatorOption',
            label: 'deviationStandard',
            markupType: 'option',
            outputType: 'filterOutput',
          },
          {
            hierarchicalType: 'operatorOption',
            label: 'mode',
            markupType: 'option',
            outputType: 'filterOutput',
          },
        ],
        outputType: 'filterOutput',
        scriptId: 0,
        selected: {
          arguments: [],
          hierarchicalType: 'selectedOperatorOption',
          label: 'mode',
          markupType: 'option',
          outputType: 'filterOutput',
        },
      }

      expect(result).toStrictEqual(expected)
    })
    it('with argument', () => {
      const mirOperator: MirAggregationTallyFilterOperator = [
        AggregationTallyFilter.deviationAbsolute,
        3,
      ]

      const cache = new Cache()
      const operator = new AggregationTallyOperatorFilter(cache, mirOperator, 0)

      const result = operator.getMarkup()
      const expected = {
        hierarchicalType: 'operator',
        id: 1,
        label: 'deviationAbsolute',
        markupType: 'select',
        options: [
          {
            hierarchicalType: 'operatorOption',
            label: 'deviationAbsolute',
            markupType: 'option',
            outputType: 'filterOutput',
          },
          {
            hierarchicalType: 'operatorOption',
            label: 'deviationRelative',
            markupType: 'option',
            outputType: 'filterOutput',
          },
          {
            hierarchicalType: 'operatorOption',
            label: 'deviationStandard',
            markupType: 'option',
            outputType: 'filterOutput',
          },
          {
            hierarchicalType: 'operatorOption',
            label: 'mode',
            markupType: 'option',
            outputType: 'filterOutput',
          },
        ],
        outputType: 'filterOutput',
        scriptId: 0,
        selected: {
          arguments: [
            {
              hierarchicalType: 'argument',
              id: 2,
              label: 'by',
              markupType: 'input',
              value: 3,
            },
          ],
          hierarchicalType: 'selectedOperatorOption',
          label: 'deviationAbsolute',
          markupType: 'option',
          outputType: 'filterOutput',
        },
      }

      expect(result).toStrictEqual(expected)
    })
  })

  describe('getMir', () => {
    it('without argument', () => {
      const mirOperator: MirAggregationTallyFilterOperator = AggregationTallyFilter.mode

      const cache = new Cache()
      const operator = new AggregationTallyOperatorFilter(cache, mirOperator, 0)

      const result = operator.getMir()

      expect(result).toStrictEqual(mirOperator)
    })
    it('with argument', () => {
      const mirOperator: MirAggregationTallyFilterOperator = [
        AggregationTallyFilter.deviationAbsolute,
        3,
      ]

      const cache = new Cache()
      const operator = new AggregationTallyOperatorFilter(cache, mirOperator, 0)

      const result = operator.getMir()
      expect(result).toStrictEqual(mirOperator)
    })
  })
  describe('update', () => {
    it('without argument', () => {
      const mirOperator: MirAggregationTallyFilterOperator = AggregationTallyFilter.mode

      const cache = new Cache()
      const operator = new AggregationTallyOperatorFilter(cache, mirOperator, 0)

      operator.update(AggregationTallyFilter.deviationAbsolute)

      expect(operator.code).toStrictEqual(AggregationTallyFilter.deviationAbsolute)
      expect(operator.argument).toBeTruthy()
    })

    it('with argument', () => {
      const mirOperator: MirAggregationTallyFilterOperator = [
        AggregationTallyFilter.deviationAbsolute,
        3,
      ]

      const cache = new Cache()
      const operator = new AggregationTallyOperatorFilter(cache, mirOperator, 0)

      operator.update(AggregationTallyFilter.deviationStandard)

      expect(operator.code).toStrictEqual(AggregationTallyFilter.deviationStandard)
      expect(operator.argument).toBeTruthy()
    })
  })
})
