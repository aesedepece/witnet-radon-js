import { MirRequest, OperatorCode, MarkupRequest } from './types'
import { Cache } from './structures'
import { Source } from './source'
import { AggregationTallyScript } from './aggregationTallyScript'
import { Script } from './script'
import { Operator } from './operator'
import { Argument } from './argument'
import { formatJs } from './utils'

export class Radon {
  public cache: Cache

  public timelock: number
  public retrieve: Array<Source>
  public aggregate: AggregationTallyScript
  public tally: AggregationTallyScript

  constructor(radRequest: MirRequest) {
    this.cache = new Cache()
    this.timelock = radRequest.timelock
    this.retrieve = radRequest.retrieve.map((source) => new Source(this.cache, source))
    this.aggregate = new AggregationTallyScript(this.cache, radRequest.aggregate)
    this.tally = new AggregationTallyScript(this.cache, radRequest.tally)
  }

  public addOperator(scriptId: number) {
    ;(this.cache.get(scriptId) as Script).addOperator()
  }

  public addSource() {
    this.retrieve.push(
      new Source(this.cache, {
        url: '',
        script: [OperatorCode.StringAsFloat],
        kind: 'HTTP-GET',
        contentType: 'JSON API',
      })
    )
  }

  public deleteOperator(scriptId: number, operatorId: number) {
    ;(this.cache.get(scriptId) as Script).deleteOperator(operatorId)
  }

  public deleteSource(sourceIndex: number) {
    this.retrieve.splice(sourceIndex, 1)
  }

  public getJs(): string {
    const sourcesDeclaration = this.retrieve
      .map((source, index) => `${source.getJs(index)}`)
      .join('\n')
    const aggregatorDeclaration = this.aggregate.getJs('aggregator')
    const tallyDeclaration = this.tally.getJs('tally')

    const addSources = this.retrieve
      .map((_, index) => '.addSource(source_' + index + ')\n')
      .join('')

    const js = `import * as Witnet from "witnet-requests"

                const request = new Witnet.Request()

                ${sourcesDeclaration}

                ${aggregatorDeclaration}

                ${tallyDeclaration}

                const request = new Witnet.Request()
                  ${addSources}
                  .setAggregator(aggregator) // Set the aggregator function
                  .setTally(tally) // Set the tally function
                  .setQuorum(4, 70) // Set witness count
                  .setFees(10, 1, 1, 1) // Set economic incentives
                  .schedule(0) // Make this request immediately solvable

                export { request as default }`

    return formatJs(js)
  }

  public getMarkup(): MarkupRequest {
    return {
      timelock: this.timelock,
      retrieve: this.retrieve.map((source) => source.getMarkup()),
      aggregate: this.aggregate.getMarkup(),
      tally: this.tally.getMarkup(),
    }
  }

  public getMir(): MirRequest {
    return {
      timelock: this.timelock,
      retrieve: this.retrieve.map((source) => source.getMir()),
      aggregate: this.aggregate.getMir(),
      tally: this.tally.getMir(),
    } as MirRequest
  }

  // TODO: Remove any
  public update(id: number, value: any) {
    ;(this.cache.get(id) as Operator | Argument).update(value)
  }

  public updateSource(sourceIndex: number, args: any) {
    this.retrieve[sourceIndex].update(args)
  }
}
