export interface Repository<DataType> {
  findById(id: string): Promise<DataType | null>;
  save(data: DataType): Promise<void>;
  create(data: DataType): Promise<void>;
  delete(data: DataType): Promise<void>;
}
