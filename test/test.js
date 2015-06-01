
describe('<sample-element>', function() {

  it('Renders the greeting property', function() {
    expect(document.querySelector('#greeting').innerHTML).to.equal('Hello!');
  });

  it("Responds to changes in the property's value", function() {
    var sample = document.querySelector('#sample');
    expect(sample.innerHTML).to.not.match(/>Modified!</);
    sample.greeting = 'Modified!';
    expect(sample.innerHTML).to.match(/>Modified!</);
  });

});
