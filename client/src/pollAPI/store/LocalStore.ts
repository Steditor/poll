import { reactive } from "vue";

interface LocalData {
  sentVote: number | undefined;
}

export default class LocalStore implements LocalData {
  private readonly _properties = reactive<LocalData>({
    sentVote: undefined,
  });

  get sentVote(): number | undefined {
    return this._properties.sentVote;
  }

  set sentVote(sentVote: number | undefined) {
    this._properties.sentVote = sentVote;
  }

  clear() {
    this._properties.sentVote = undefined;
  }
}
