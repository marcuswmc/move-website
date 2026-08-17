import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Usuário", plural: "Usuários" },
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email"],
    group: "Configurações",
  },
  access: {
    // `anyone` na criação só vale até existir o primeiro usuário — depois disso o
    // Payload bloqueia sozinho o /admin/create-first-user.
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
      required: true,
    },
  ],
};
