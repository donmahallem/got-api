import * as mariadb from "mysql";

export class Article {

    public readonly id: number;
    public readonly gtin: string;
    public readonly title: string;
    public readonly description: string;


    public save() {

    }

    public static loadById(id: number): Article {
        return null;
    }
    public static searchByGtin(gtin: string): Article[] {
        return null;
    }
    public static searchByTitle(title: string): Article[] {
        return null;
    }
}