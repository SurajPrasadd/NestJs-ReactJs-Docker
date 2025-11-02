import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SequenceFixService {
  private readonly logger = new Logger(SequenceFixService.name);

  constructor(private readonly dataSource: DataSource) {}

  async fixSequences(): Promise<void> {
    this.logger.log('🔧 Fixing PostgreSQL sequences...');

    // SQL query to find all sequences in the database
    const sequences = await this.dataSource.query(`
      SELECT
        c.oid::regclass::text AS seq_name,
        n.nspname AS schema_name
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'S';
    `);

    for (const seq of sequences) {
      const seqName = seq.seq_name;

      // Derive table name from sequence name (assumes pattern table_id_seq)
      const tableName = seqName.replace(/_id_seq$/, '');
      const idColumn = 'id';

      try {
        const query = `
          SELECT setval(
            '${seqName}',
            COALESCE((SELECT MAX(${idColumn}) FROM ${tableName}), 0) + 1,
            false
          )
        `;
        await this.dataSource.query(query);

        this.logger.log(`✅ Synced sequence for table: ${tableName}`);
      } catch (err) {
        this.logger.warn(`⚠️ Skipped sequence ${seqName}: ${err.message}`);
      }
    }

    this.logger.log('🎯 All sequences synced successfully!');
  }
}
