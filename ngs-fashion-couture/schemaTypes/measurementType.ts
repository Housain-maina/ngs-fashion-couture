import {defineField, defineType} from 'sanity'

export const measurementType = defineType({
  name: 'measurement',
  title: 'Measurement',
  type: 'document',

  fields: [
    defineField({
      name: 'customer',
      type: 'reference',
      weak: true,
      to: [{type: 'customer'}],
    }),
    defineField({
      name: 'S',
      type: 'string',
    }),
    defineField({
      name: 'H',
      type: 'string',
    }),
    defineField({
      name: 'N',
      type: 'string',
    }),
    defineField({
      name: 'SL',
      type: 'string',
    }),
    defineField({
      name: 'FR',
      type: 'string',
    }),
    defineField({
      name: 'TL',
      type: 'string',
    }),
    defineField({
      name: 'Lap',
      type: 'string',
    }),
    defineField({
      name: 'FW',
      type: 'string',
    }),
    defineField({
      name: 'Links',
      type: 'string',
    }),
    defineField({
      name: 'HK',
      type: 'string',
    }),
    defineField({
      name: 'BBR',
      type: 'string',
    }),
    defineField({
      name: 'B',
      type: 'string',
    }),
    defineField({
      name: 'W',
      type: 'string',
    }),
    defineField({
      name: 'L',
      type: 'string',
    }),
    defineField({
      name: 'HL',
      type: 'string',
    }),
    defineField({
      name: 'SH',
      type: 'string',
    }),
    defineField({
      name: 'UB',
      type: 'string',
    }),
    defineField({
      name: 'WL',
      type: 'string',
    }),
    defineField({
      name: 'HP',
      type: 'string',
    }),
    defineField({
      name: 'E',
      type: 'string',
    }),
  ],

  preview: {
    select: {
      title: 'customer.names',
    },
  },
})
