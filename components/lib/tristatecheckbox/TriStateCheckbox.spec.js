import { config, mount } from '@vue/test-utils';
import TriStateCheckbox from './TriStateCheckbox.vue';

config.global.mocks = {
    $primevue: {
        config: {
            locale: {
                aria: {
                    trueLabel: 'trueLabel',
                    falseLabel: 'falseLabel',
                    nullLabel: 'nullLabel'
                }
            }
        }
    }
};
let wrapper;
const modelValues = [true, false, null];
const emittedResults = [false, null, true];

describe('TriStateCheckbox.vue', () => {
    beforeEach(() => {
        wrapper = mount(TriStateCheckbox);
    });

    it('When onClick method triggered some methods effect', () => {
        const mockUpdateModel = vi.fn();

        wrapper.vm.updateModel = mockUpdateModel;

        wrapper.vm.onClick('test');

        expect(wrapper.vm.updateModel).toBeCalled();
        expect(wrapper.emitted()['click']).toBeTruthy();
        expect(wrapper.emitted()['change']).toBeTruthy();
    });

    it('When event.code is not equal Enter methods should not be effected', async () => {
        wrapper.vm.onKeyDown({ code: 'test' });

        expect(wrapper.emitted().keydown).toBeFalsy();
    });

    it('When event.code is equal Enter some methods should be triggered', async () => {
        const mockUpdateModel = vi.fn();

        wrapper.vm.updateModel = mockUpdateModel;

        wrapper.vm.onKeyDown({ code: 'Enter', preventDefault: () => {} });

        expect(wrapper.vm.updateModel).toBeCalled();
        expect(wrapper.emitted().keydown).toBeTruthy();
    });

    it('When onBlur is triggered focused property should be false', async () => {
        wrapper.vm.onBlur();

        expect(wrapper.vm.focused).toBeFalsy();
        expect(wrapper.emitted().blur).toBeTruthy();
    });
});

describe('UpdateModel method tests', () => {
    beforeEach(() => {
        wrapper = mount(TriStateCheckbox);
    });

    it('When disable props true updateModal should not triggered emit', async () => {
        await wrapper.setProps({
            disabled: true,
            modelValue: null
        });

        wrapper.vm.updateModel();

        expect(wrapper.emitted()['update:modelValue']).toBeFalsy();
    });

    it('When disable props false updateModal should triggered emit', () => {
        wrapper.vm.updateModel();

        expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    });

    modelValues.forEach((modelValue, index) => {
        it('When modelValue changed update model emitted value should be change', async () => {
            await wrapper.setProps({
                modelValue
            });

            wrapper.vm.updateModel();

            expect(wrapper.emitted()['update:modelValue']).toEqual([[emittedResults[index]]]);
        });
    });
});
