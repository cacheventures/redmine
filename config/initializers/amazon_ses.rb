if Rails.env.production?
  ActionMailer::Base.add_delivery_method :ses, AWS::SES::Base,
    :access_key_id     => ENV['ses_access_key_id'],
    :secret_access_key => ENV['ses_secret_access_key']
end