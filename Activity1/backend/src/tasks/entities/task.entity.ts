import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity('tasks')
export class Task {
    @ObjectIdColumn()
    _id: ObjectId;

    // Add a getter for id to maintain compatibility
    get id(): string {
        return this._id ? this._id.toString() : '';
    }

    @Column()
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false, type: 'boolean' })
    completed: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt?: Date;

    // Add a proper type transformer to ensure boolean values
    constructor(partial?: Partial<Task>) {
        if (partial) {
            Object.assign(this, partial);

            // Ensure completed is always a boolean
            if (partial.completed !== undefined) {
                this.completed = Boolean(partial.completed);
            } else {
                this.completed = false;
            }
        }
    }
}
