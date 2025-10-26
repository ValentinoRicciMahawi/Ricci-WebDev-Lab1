from rest_framework import serializers
from basic_api.models import DRFDosen, DRFPost, DRFStudent

class DRFPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = DRFPost
        fields = '__all__'

class DRFDosenSerializer(serializers.ModelSerializer):
    class Meta:
        model = DRFDosen
        fields = '__all__'

class DRFStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DRFStudent
        fields = '__all__'
        extra_kwargs = {'mentor': {'required': True, 'allow_null': False}}