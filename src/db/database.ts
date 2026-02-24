import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Propriedade, Cultura, Safra, Despesa, Venda } from "./models";

interface AgroDBSchema extends DBSchema {
  propriedade: { key: string; value: Propriedade };
  culturas: { key: string; value: Cultura };
  safras: { key: string; value: Safra; indexes: { "by-cultura": string } };
  despesas: { key: string; value: Despesa; indexes: { "by-data": string } };
  vendas: { key: string; value: Venda; indexes: { "by-data": string } };
}

let dbPromise: Promise<IDBPDatabase<AgroDBSchema>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<AgroDBSchema>("agrogestao", 1, {
      upgrade(db) {
        db.createObjectStore("propriedade", { keyPath: "id" });
        db.createObjectStore("culturas", { keyPath: "id" });
        const safras = db.createObjectStore("safras", { keyPath: "id" });
        safras.createIndex("by-cultura", "culturaId");
        const despesas = db.createObjectStore("despesas", { keyPath: "id" });
        despesas.createIndex("by-data", "data");
        const vendas = db.createObjectStore("vendas", { keyPath: "id" });
        vendas.createIndex("by-data", "data");
      },
    });
  }
  return dbPromise;
}

// Generic ID generator
export const genId = () => crypto.randomUUID();

// Propriedade
export async function getPropriedade(): Promise<Propriedade | undefined> {
  const db = await getDB();
  const all = await db.getAll("propriedade");
  return all[0];
}

export async function savePropriedade(p: Propriedade) {
  const db = await getDB();
  await db.put("propriedade", p);
}

// Culturas
export async function getCulturas(): Promise<Cultura[]> {
  const db = await getDB();
  return db.getAll("culturas");
}

export async function saveCultura(c: Cultura) {
  const db = await getDB();
  await db.put("culturas", c);
}

export async function deleteCultura(id: string) {
  const db = await getDB();
  await db.delete("culturas", id);
}

// Safras
export async function getSafras(): Promise<Safra[]> {
  const db = await getDB();
  return db.getAll("safras");
}

export async function getSafrasByCultura(culturaId: string): Promise<Safra[]> {
  const db = await getDB();
  return db.getAllFromIndex("safras", "by-cultura", culturaId);
}

export async function saveSafra(s: Safra) {
  const db = await getDB();
  await db.put("safras", s);
}

export async function deleteSafra(id: string) {
  const db = await getDB();
  await db.delete("safras", id);
}

// Despesas
export async function getDespesas(): Promise<Despesa[]> {
  const db = await getDB();
  return db.getAll("despesas");
}

export async function saveDespesa(d: Despesa) {
  const db = await getDB();
  await db.put("despesas", d);
}

export async function deleteDespesa(id: string) {
  const db = await getDB();
  await db.delete("despesas", id);
}

// Vendas
export async function getVendas(): Promise<Venda[]> {
  const db = await getDB();
  return db.getAll("vendas");
}

export async function saveVenda(v: Venda) {
  const db = await getDB();
  await db.put("vendas", v);
}

export async function deleteVenda(id: string) {
  const db = await getDB();
  await db.delete("vendas", id);
}

// Backup & Restore
export async function exportAllData() {
  const db = await getDB();
  return {
    propriedade: await db.getAll("propriedade"),
    culturas: await db.getAll("culturas"),
    safras: await db.getAll("safras"),
    despesas: await db.getAll("despesas"),
    vendas: await db.getAll("vendas"),
  };
}

export async function importAllData(data: {
  propriedade?: Propriedade[];
  culturas?: Cultura[];
  safras?: Safra[];
  despesas?: Despesa[];
  vendas?: Venda[];
}) {
  const db = await getDB();
  const tx = db.transaction(
    ["propriedade", "culturas", "safras", "despesas", "vendas"],
    "readwrite"
  );
  // Clear all stores
  await Promise.all([
    tx.objectStore("propriedade").clear(),
    tx.objectStore("culturas").clear(),
    tx.objectStore("safras").clear(),
    tx.objectStore("despesas").clear(),
    tx.objectStore("vendas").clear(),
  ]);
  // Import data
  for (const p of data.propriedade || []) await tx.objectStore("propriedade").put(p);
  for (const c of data.culturas || []) await tx.objectStore("culturas").put(c);
  for (const s of data.safras || []) await tx.objectStore("safras").put(s);
  for (const d of data.despesas || []) await tx.objectStore("despesas").put(d);
  for (const v of data.vendas || []) await tx.objectStore("vendas").put(v);
  await tx.done;
}
