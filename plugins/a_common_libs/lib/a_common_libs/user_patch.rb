module ACommonLibs
  module UserPatch
    def self.included(base)
      base.send(:include, InstanceMethods)
    end

    module InstanceMethods
      def favourite_project
        @fv_pr ||= (Project.where(id: self.preference.favourite_project_id.to_i).first || get_favourite_project)
      end

      def get_favourite_project
        return @fav_project if @fav_project
        @fav_project = Project.select("#{Project.table_name}.*, COUNT(#{Journal.table_name}.id) AS num_actions")
                              .joins({:issues => :journals})
                              .where("#{Journal.table_name}.user_id = ?", id)
                              .group("#{Project.table_name}.id")
                              .order('num_actions DESC')
                              .limit(1)
                              .try(:first)

        @fav_project = Project.all.first unless @fav_project

        if self.preference.favourite_project_id.nil? && !@fav_project.nil?
          self.preference.favourite_project_id = @fav_project.id
          self.preference.save
        end

        @fav_project
      end
    end

  end
end
