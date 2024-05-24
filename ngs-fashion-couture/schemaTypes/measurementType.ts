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
      name: 'Armhole',
      type: 'string',
    }),
    defineField({
      name: 'Shoulder',
      type: 'string',
    }),
    defineField({
      name: 'Bost',
      type: 'string',
    }),
    defineField({
      name: 'UnderBost',
      type: 'string',
    }),
    defineField({
      name: 'BostPoint',
      type: 'string',
    }),
    defineField({
      name: 'HaveCut',
      type: 'string',
    }),
    defineField({
      name: 'Neeple',
      type: 'string',
    }),
    defineField({
      name: 'BlauseLength',
      type: 'string',
    }),
    defineField({
      name: 'SkirtHips',
      type: 'string',
    }),
    defineField({
      name: 'SkirtLength',
      type: 'string',
    }),
    defineField({
      name: 'GwonLength',
      type: 'string',
    }),
    defineField({
      name: 'SlipLength',
      type: 'string',
    }),
    defineField({
      name: 'RoundSlip',
      type: 'string',
    }),
  ],

  preview: {
    select: {
      title: 'customer.names',
    },
  },
})
