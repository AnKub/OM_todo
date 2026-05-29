export class TaskEntry {
  public constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly createdAt: string,
    public readonly completed: boolean = false,
  ) {}

  public rename(nextTitle: string) {
    return new TaskEntry(this.id, nextTitle, this.createdAt, this.completed)
  }
}