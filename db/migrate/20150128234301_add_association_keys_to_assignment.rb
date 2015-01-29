class AddAssociationKeysToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :user_id, :integer
    add_column :assignments, :course_id, :integer
    add_column :assignments, :article_id, :integer
  end
end
