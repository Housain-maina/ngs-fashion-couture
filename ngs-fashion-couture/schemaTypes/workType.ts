import {defineField, defineType} from 'sanity'

export const workType = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',

  fields: [
    defineField({
      name: 'customer',
      type: 'reference',
      weak: true,
      to: [{type: 'customer'}],
    }),
    defineField({
      name: 'price',
      type: 'string',
    }),
    defineField({
      name: 'amountPaid',
      type: 'string',
    }),
    defineField({
      name: 'intakeDate',
      type: 'date',
    }),
    defineField({
      name: 'collectionDate',
      type: 'date',
    }),
    defineField({
      name: 'collected',
      type: 'boolean',
    }),
    defineField({
      name: 'done',
      type: 'boolean',
    }),
  ],

  preview: {
    select: {
      title: 'customer.names',
      subtitle: 'collectionDate',
    },
  },
})
