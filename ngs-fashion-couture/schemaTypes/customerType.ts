import {defineField, defineType} from 'sanity'

export const customerType = defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',

  fields: [
    defineField({
      name: 'names',
      type: 'string',
    }),
    defineField({
      name: 'phoneNumber',
      type: 'string',
    }),
    defineField({
      name: 'gender',
      type: 'string',
      options: {
        list: [
          {title: 'Male', value: 'male'},
          {title: 'Female', value: 'female'},
        ],
      },
    }),
  ],
})
