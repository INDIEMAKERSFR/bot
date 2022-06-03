declare module "mentions" {
    function findMentions(s: string): {
        get(): string[]
    }

    export default findMentions;
}

declare module "find-hashtags" {
    function findHashtags(s: string): string[]

    export default findHashtags;
}

