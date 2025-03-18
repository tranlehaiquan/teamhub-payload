import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "trainings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_skills_id" integer
  );
  
  DO $$ BEGIN
   ALTER TABLE "trainings_rels" ADD CONSTRAINT "trainings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."trainings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "trainings_rels" ADD CONSTRAINT "trainings_rels_users_skills_fk" FOREIGN KEY ("users_skills_id") REFERENCES "public"."users_skills"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "trainings_rels_order_idx" ON "trainings_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "trainings_rels_parent_idx" ON "trainings_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "trainings_rels_path_idx" ON "trainings_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "trainings_rels_users_skills_id_idx" ON "trainings_rels" USING btree ("users_skills_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "trainings_rels" CASCADE;`)
}
