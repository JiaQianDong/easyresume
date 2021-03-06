		window.EditSection = React.createClass({
				getDefaultProps:function(){
					return {
						json:{
						    fragments:[],
                            points:[]
                        },
						onSectionChange:function(sectionJSON){}
					}
				},

				getInitialState:function(){
					return this.props.json;
				},

				//列表fragment内容改变
				handlePointChange:function(jsonKey,pointIndex, value){
						var json = this.state;
						json.points[pointIndex]=value;
						this.props.onSectionChange(json);
				},

				//通用fragment内容改变
				handleFragmentChange:function(framentIndex,fragmentJSON){
					var json = this.state;
					json.fragments[framentIndex]=fragmentJSON;
					this.props.onSectionChange(json);//触发section change
				},

                handleFragmentDelete:function(fragmentIndex){
                    var json = this.state;
                    json.fragments.splice(fragmentIndex,1);
                    this.props.onSectionChange(json);//触发section change
                },

				//add one frament
				handleAddFragments: function(sectionKey, event){
					var json = this.state;
					var fragments = json.fragments;
					fragments.push($.extend({},Fragment.emptyJSON));
					this.setState({
						fragments : fragments
					});

					this.props.onSectionChange(json);//触发section change

				},

				render:function(){
					var self = this;
					var section = this.state;
					var onValueChange = function(jsonKey, value){
						console.debug("onValueChange for edit sections " +"jsonKey = " + jsonKey + "value  = " + value);
						var json = self.state;
						json[jsonKey] = value; 
						self.props.onSectionChange(json);
					};

					return (
							<div className="sectionBox">
								<div className="header">
									<StringInput className="header"
												label={''}
												jsonKey={'title'}
												value={section.title}
												onValueChange={onValueChange}
									/>
								</div>

								{
								    //有fragment和points 2选一
									section.fragments
										?
										section.fragments.map(function(f,framentIndex){
											var onFragmentChange = function(framentIndex){
												return function(fragmentJSON){
													self.handleFragmentChange(framentIndex,fragmentJSON);
												}
											}(framentIndex);

                                            let onFragmentDelete = function(framentIndex){
                                                return function(){
                                                    self.handleFragmentDelete(framentIndex);
                                                }
                                            }(framentIndex);

											return <div key={"fragments-_"+framentIndex} >
                                                        <div className="fragment-wrapper" >
                                                            <FragmentEditInput
                                                                        json={f}
                                                                        onFragmentChange={onFragmentChange}
                                                                    />
                                                         <a href = "#" className="deleteFragment" onClick = {onFragmentDelete}>delete</a>
                                                        </div>
                                                    </div>
										})

										:
                                        function() {
                                            return <div className="points-block-wrapper">
                                                <ArrayInput label="" jsonKey="points" values={section.points}
                                                            onValueChange={self.handlePointChange}/>
                                            </div>
                                        }()
								}
                                {
                                    section.fragments?
                                        <a href="#" title={"点击添加一个" + section.title + "经历"} className="add-fragment"
                                           onClick={self.handleAddFragments.bind(self, "sections")}>
                                            添加一段{section.title}
                                        </a> : undefined
                                }


							</div>
						)
				}

		});


		window.EditSections = React.createClass({
				getDefaultProps:function(){
					return {
						onSectionsChange:function(sectionIndex,newSection){},
						jsons:[]
					}
				},

				handleSectionsChange:function(sectionIndex,sectionJSON){
					this.props.onSectionsChange(sectionIndex,sectionJSON);	
				},

				render:function(){
						var sections = this.props.jsons;
						var self = this;
						console.log('[EditSections][render]sections:',sections);
						return(		
								<div id="editSections" className="edit-section" jsonKey="sections">
									{
										sections.map(function(section,i){
											var sectionIndex= i;
											
											var onSectionChange =  function(sectionIndex){
												return function(sectionJSON){
													self.handleSectionsChange(sectionIndex,sectionJSON);
												}
											}(sectionIndex);


											
											return 	<EditSection key={i} json={section} index={i}
													onSectionChange={onSectionChange}
													/>
										})
									}
								</div>	
						)
				}
			});