require 'helpers/unique_names_helper'

include UniqueNamesHelper

FactoryGirl.define do
  factory :user_table, class: UserTable do
    name { unique_name('user_table') }
  end

  factory :carto_user_table, class: Carto::UserTable do
    name { unique_name('user_table') }

    before(:create) do |user_table|
      user_table.service.stubs(:before_create)
      user_table.service.stubs(:after_create)
      user_table.stubs(:create_canonical_visualization)
    end

    after(:create) do |user_table|
      user_table.service.unstub(:before_create)
      user_table.service.unstub(:after_create)
      user_table.unstub(:create_canonical_visualization)
    end

    trait :with_db_table do
      before(:create) do |user_table|
        user_table.service.unstub(:before_create)
        user_table.service.unstub(:after_create)
      end
    end

    trait :with_canonical_visualization do
      before(:create) do |user_table|
        user_table.service.stubs(:is_raster?).returns(false)
        user_table.unstub(:create_canonical_visualization)
      end

      after(:create) do |user_table|
        user_table.service.unstub(:is_raster?)
      end
    end

    factory :private_user_table do
      privacy Carto::UserTable::PRIVACY_PRIVATE
    end

    factory :public_user_table do
      privacy Carto::UserTable::PRIVACY_PUBLIC
    end
  end
end
