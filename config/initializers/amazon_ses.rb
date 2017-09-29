ActionMailer::Base.add_delivery_method(
  :ses,
  AWS::SES::Base,
  access_key_id: 'AKIAICX4E4MTMUACG6OA',
  secret_access_key: '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'
)
