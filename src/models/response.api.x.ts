

// X - INTERFACES
export interface Tweet{
    id: string,
    edit_history_tweet_ids: string[],
    text: string
}

export interface Meta{
    newest_id: string,
    oldest_id: string,
    result_count: number
}

export interface ResponseX {
    data: Tweet[],
    meta: Meta
}