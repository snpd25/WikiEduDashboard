
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getWeeksArray } from '../../selectors';
import Block from '../timeline/block';
import TrainingModules from '../timeline/training_modules';
import Handouts from './handouts';
import Templates from './templates';
import { BLOCK_KIND_RESOURCES } from '../../constants/timeline';

const flattenAndCompact = _.flow([_.flatten, _.compact]);

const Resources = ({ weeks, current_user, course }) => {
  const trainingLibrarySlug = course.training_library_slug;
  let instructorModulesLink;
  if (current_user.isInstructor && Features.wikiEd) {
    instructorModulesLink = <a href={'/training/instructors'} className="button pull-right">Instructor orientation modules</a>;
  }
  const blocks = _.flatten(weeks.map(week => week.blocks));
  const modules = flattenAndCompact(blocks.map(block => block.training_modules));

  let additionalResources;
  const additionalResourcesBlocks = blocks.filter(block => block.kind === BLOCK_KIND_RESOURCES);
  if (additionalResourcesBlocks) {
    additionalResources = (
      <div className="list-unstyled container mt2 mb2">
        {additionalResourcesBlocks.map(block => <Block key={block.id} block={block} trainingLibrarySlug={trainingLibrarySlug} />)}
      </div>
    );
  }
  let assignedModules;
  if (modules.length) {
    assignedModules = (
      <TrainingModules
        block_modules={modules}
        trainingLibrarySlug={trainingLibrarySlug}
        header="Assigned trainings"
      />
    );
  }
  let additionalModules;
  if (Features.wikiEd) {
     additionalModules = (
       <a href={`/training/${trainingLibrarySlug}`} className="button pull-right ml1">Additional training modules</a>
    );
  } else {
    additionalModules = (
      <a href={'/training'} className="button dark mb1">{I18n.t('training.training_library')}</a>
    );
  }

  return (
    <div id="resources" className="w75">
      <div className="section-header">
        <h3>{I18n.t('resources.header')}</h3>
        <div id="training-modules" className="container">
          {assignedModules}
          {additionalModules}
          {instructorModulesLink}
        </div>
        {additionalResources}
        { Features.wikiEd && <Templates /> }
        <Handouts trainingLibrarySlug={trainingLibrarySlug} blocks={blocks} />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  weeks: getWeeksArray(state)
});

export default connect(mapStateToProps)(Resources);
